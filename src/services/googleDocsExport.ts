import {
  buildGoogleDocsBatchRequests,
  COA_USER_MANUAL,
  ManualMetrics,
} from '../data/userManual';
import { clearAccessToken } from './googleDocsAuth';

export interface CreatedGoogleDoc {
  documentId: string;
  title: string;
  editUrl: string;
  metrics: ManualMetrics;
}

export type ExportFormat = 'pdf' | 'docx';

const EXPORT_MIME_MAP: Record<ExportFormat, { mime: string; ext: string }> = {
  pdf: {
    mime: 'application/pdf',
    ext: 'pdf',
  },
  docx: {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ext: 'docx',
  },
};

async function parseGoogleApiError(res: Response, fallback: string): Promise<string> {
  if (res.status === 401 || res.status === 403) {
    clearAccessToken();
    return 'Google session expired or lacks permission. Please sign in with Google again.';
  }
  try {
    const body = (await res.json()) as { error?: { message?: string } };
    if (body?.error?.message) return body.error.message;
  } catch {
    // ignore JSON parse failure
  }
  return `${fallback} (HTTP ${res.status})`;
}

export async function createUserManualGoogleDoc(
  accessToken: string,
): Promise<CreatedGoogleDoc> {
  const { requests, metrics } = buildGoogleDocsBatchRequests(COA_USER_MANUAL);
  const title = 'COA Interactive Lab - User Manual (21CSS201T)';

  // 1. Create empty document via Google Docs API
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    throw new Error(await parseGoogleApiError(createRes, 'Failed to create Google Document'));
  }

  const created = (await createRes.json()) as { documentId: string; title: string };

  // 2. Populate formatted headings, bullets, and <=10-page typography layout
  const batchRes = await fetch(
    `https://docs.googleapis.com/v1/documents/${encodeURIComponent(created.documentId)}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    },
  );

  if (!batchRes.ok) {
    throw new Error(
      await parseGoogleApiError(batchRes, 'Created document but failed to apply manual content'),
    );
  }

  return {
    documentId: created.documentId,
    title: created.title ?? title,
    editUrl: `https://docs.google.com/document/d/${created.documentId}/edit`,
    metrics,
  };
}

export async function downloadGoogleDocExport(
  accessToken: string,
  documentId: string,
  format: ExportFormat,
): Promise<void> {
  const spec = EXPORT_MIME_MAP[format];
  const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
    documentId,
  )}/export?mimeType=${encodeURIComponent(spec.mime)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(
      await parseGoogleApiError(res, `Failed to export document as ${format.toUpperCase()}`),
    );
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = `COA-Interactive-Lab-User-Manual.${spec.ext}`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
}
