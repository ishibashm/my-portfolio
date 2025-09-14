/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.cloud-palette.com', // あなたのサイトのドメイン
  generateRobotsTxt: true, // robots.txtも自動生成する
  sitemapSize: 7000,
  outDir: './out',
};