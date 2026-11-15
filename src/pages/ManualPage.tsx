import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  LogOut,
  Printer,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { COA_USER_MANUAL, computeManualMetrics } from '../data/userManual';
import { useLab } from '../context/LabContext';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import {
  clearAccessToken,
  getAccessToken,
  GoogleDocsAuthSnapshot,
  signInWithGoogleDocs,
  signOutGoogleDocs,
  subscribeAuthState,
} from '../services/googleDocsAuth';
import {
  CreatedGoogleDoc,
  createUserManualGoogleDoc,
  downloadGoogleDocExport,
  ExportFormat,
} from '../services/googleDocsExport';

export const ManualPage: React.FC = () => {
  const { navigate } = useLab();
  const metrics = useMemo(() => computeManualMetrics(COA_USER_MANUAL), []);

  const [authState, setAuthState] = useState<GoogleDocsAuthSnapshot>({
    user: null,
    hasAccessToken: false,
  });
  const [signingIn, setSigningIn] = useState(false);
  const [creatingDoc, setCreatingDoc] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);
  const [createdDoc, setCreatedDoc] = useState<CreatedGoogleDoc | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeAuthState((snapshot) => {
      setAuthState(snapshot);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    setSigningIn(true);
    try {
      const next = await signInWithGoogleDocs();
      setAuthState(next);
      setStatusMsg('Connected to Google Docs. You can now create and download the manual.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in with Google.';
      setErrorMsg(message);
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    await signOutGoogleDocs();
    setAuthState({ user: null, hasAccessToken: false });
    setCreatedDoc(null);
  };

  const handleCreateGoogleDoc = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    const token = getAccessToken();
    if (!token) {
      setErrorMsg('Please sign in with Google to authorize Google Docs creation.');
      return;
    }

    setCreatingDoc(true);
    try {
      const doc = await createUserManualGoogleDoc(token);
      setCreatedDoc(doc);
      setStatusMsg(
        `Google Document created (${doc.metrics.estimatedPages} pages estimated, within the ${doc.metrics.maxPageLimit}-page limit).`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create Google Document.';
      setErrorMsg(message);
      if (!getAccessToken()) {
        setAuthState((prev) => ({ ...prev, hasAccessToken: false }));
      }
    } finally {
      setCreatingDoc(false);
    }
  };

  const handleDownloadExport = async (format: ExportFormat) => {
    if (!createdDoc) return;
    setErrorMsg(null);
    const token = getAccessToken();
    if (!token) {
      clearAccessToken();
      setAuthState((prev) => ({ ...prev, hasAccessToken: false }));
      setErrorMsg('Session expired. Please sign in with Google again before downloading.');
      return;
    }

    setExportingFormat(format);
    try {
      await downloadGoogleDocExport(token, createdDoc.documentId, format);
      setStatusMsg(`Downloaded COA-Interactive-Lab-User-Manual.${format}.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to export ${format.toUpperCase()}.`;
      setErrorMsg(message);
      if (!getAccessToken()) {
        setAuthState((prev) => ({ ...prev, hasAccessToken: false }));
      }
    } finally {
      setExportingFormat(null);
    }
  };

  const handlePrintLocalPdf = () => {
    window.print();
  };

  const needsAuth = !authState.user || !authState.hasAccessToken;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Google Docs Export Workbench (hidden during print) */}
      <section className="no-print rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#2563EB] dark:text-[#22D3EE]">
              <BookOpen className="h-3.5 w-3.5" />
              Documentation · Course 21CSS201T
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#14213D] dark:text-white">
              COA Interactive Lab User Manual
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Concise laboratory guide covering all 5 syllabus units and 26 interactive simulators, formatted to fit cleanly within {metrics.maxPageLimit} pages.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-xs shrink-0">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 px-3 py-2 text-center">
              <div className="text-slate-500 dark:text-slate-400">Est. Length</div>
              <div className="mt-0.5 text-sm font-bold text-[#14213D] dark:text-white">
                ~{metrics.estimatedPages} / {metrics.maxPageLimit} pp
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 px-3 py-2 text-center">
              <div className="text-slate-500 dark:text-slate-400">Words</div>
              <div className="mt-0.5 text-sm font-bold text-[#2563EB] dark:text-[#22D3EE]">
                {metrics.wordCount.toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 px-3 py-2 text-center">
              <div className="text-slate-500 dark:text-slate-400">Labs</div>
              <div className="mt-0.5 text-sm font-bold text-[#14213D] dark:text-white">
                26 / 26
              </div>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {needsAuth ? (
              <GoogleSignInButton
                onClick={handleSignIn}
                disabled={signingIn}
                label={
                  signingIn
                    ? 'Signing in...'
                    : authState.user
                      ? 'Reconnect Google Docs'
                      : 'Sign in with Google'
                }
              />
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCreateGoogleDoc}
                  disabled={creatingDoc}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {creatingDoc ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {creatingDoc
                    ? 'Creating Google Doc...'
                    : createdDoc
                      ? 'Create New Google Doc Copy'
                      : 'Create Google Document'}
                </button>

                {createdDoc && (
                  <>
                    <a
                      href={createdDoc.editUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-3.5 py-2 text-sm font-semibold text-[#2563EB] dark:text-[#22D3EE] hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      Open in Google Docs
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDownloadExport('pdf')}
                      disabled={exportingFormat !== null}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      {exportingFormat === 'pdf' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      Download PDF
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadExport('docx')}
                      disabled={exportingFormat !== null}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      {exportingFormat === 'docx' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      Download DOCX
                    </button>
                  </>
                )}
              </>
            )}

            <button
              type="button"
              onClick={handlePrintLocalPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
          </div>

          {authState.user && (
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono truncate max-w-[200px]">
                {authState.user.email ?? authState.user.displayName ?? 'Signed in'}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          )}
        </div>

        {/* Feedback Banners */}
        {errorMsg && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs text-rose-700 dark:text-rose-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {statusMsg && !errorMsg && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 text-xs text-emerald-700 dark:text-emerald-300"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Quick Section Jump Table of Contents */}
        <nav aria-label="User Manual sections" className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Contents
          </div>
          <div className="flex flex-wrap gap-2">
            {COA_USER_MANUAL.sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-[#2563EB] hover:text-[#2563EB] dark:hover:text-[#22D3EE] transition-colors"
              >
                {sec.number}. {sec.title.replace(/^Unit (\d) Lab — /, 'Unit $1: ')}
              </a>
            ))}
          </div>
        </nav>
      </section>

      {/* Printable Manual Document Preview */}
      <article className="manual-print-sheet rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-10 space-y-8 shadow-xs">
        <header className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-2">
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2563EB] dark:text-[#22D3EE]">
            {COA_USER_MANUAL.version} · Max {metrics.maxPageLimit} Pages (Est. {metrics.estimatedPages} Pages)
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#14213D] dark:text-white">
            {COA_USER_MANUAL.docTitle}
          </h2>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {COA_USER_MANUAL.subtitle}
          </p>
        </header>

        <div className="space-y-7">
          {COA_USER_MANUAL.sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="space-y-3 scroll-mt-20">
              <h3 className="font-display text-lg font-bold text-[#14213D] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5">
                {sec.number}. {sec.title}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {sec.intro}
              </p>

              {sec.bullets && (
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                  {sec.bullets.map((b, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {b.label && (
                        <strong className="text-[#14213D] dark:text-white">{b.label}: </strong>
                      )}
                      {b.text}
                    </li>
                  ))}
                </ul>
              )}

              {sec.simGuides && (
                <div className="space-y-3 pt-1">
                  {sec.simGuides.map((sg) => (
                    <div
                      key={sg.simId}
                      className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-display text-sm font-bold text-[#2563EB] dark:text-[#22D3EE]">
                          {sg.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => navigate('workspace', { simId: sg.simId })}
                          className="no-print text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#22D3EE] cursor-pointer"
                        >
                          Open Lab →
                        </button>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <li>
                          <strong className="text-[#14213D] dark:text-white">Controls: </strong>
                          {sg.controls}
                        </li>
                        <li>
                          <strong className="text-[#14213D] dark:text-white">Observe: </strong>
                          {sg.observe}
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
};
