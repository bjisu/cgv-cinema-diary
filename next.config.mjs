/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // distDir 은 기본값(.next)을 그대로 쓴다.
  // 커스텀 distDir 을 주면 Vercel 이 빌드 산출물을 찾지 못해 전 경로가 404 가 된다.
  // 개발 서버를 켠 채로 `npm run build` 를 돌리면 .next 가 덮어써져 dev 쪽 CSS 가
  // 404 나므로, 빌드 전에는 개발 서버를 먼저 종료할 것.
};

export default nextConfig;
