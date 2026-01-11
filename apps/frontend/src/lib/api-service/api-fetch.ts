'use server';

type ApiFetchOptions = {
  tags?: string[];
  revalidate?: number | false;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
};

type ApiError = {
  status: number;
  message: string;
};

export async function apiFetch<Resp>(
  url: string,
  options?: ApiFetchOptions,
  body?: Resp,
): Promise<Resp | ApiError> {
  const { tags = [], revalidate, method = 'GET' } = options || {};
  const fullUrl = `${process.env.BACKEND_URL}/${url}`;

  try {
    const res = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY ?? '',
      },
      next: {
        revalidate: revalidate ?? false,
        // number: seconds to revalidate, false: permanently cached (until manual revalidation), 0: do not cache
        tags: tags.length > 0 ? tags : undefined,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return (await res.json()) as Resp;
  } catch (e) {
    console.error('Error in api fetch', e);
    throw e;
  }
}
