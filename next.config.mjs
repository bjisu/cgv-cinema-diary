/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 개발 서버가 도는 중에 `npm run build` 를 실행하면 같은 .next 폴더를 덮어써서
  // dev 서버의 CSS 청크가 404가 된다(= 스타일이 통째로 사라짐).
  // 빌드/실행은 별도 폴더를 쓰게 해서 충돌을 원천 차단한다.
  distDir: process.env.NODE_ENV === "production" ? ".next-prod" : ".next",
};

export default nextConfig;
