// pages/api/minio-proxy/[...path].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const target = 'http://minio:9000';
  
  // Proxy the request to MinIO
  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/api/minio-proxy': '', // Remove the proxy path prefix
    },
  });

  return proxy(req, res);
}