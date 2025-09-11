import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりませんでした - 404エラー",
  description: "お探しのページは見つかりませんでした。",
};

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - ページが見つかりません</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <a
        href="/"
        style={{
          color: '#0070f3',
          textDecoration: 'none',
          fontSize: '1.1rem',
          padding: '0.5rem 1rem',
          border: '1px solid #0070f3',
          borderRadius: '4px'
        }}
      >
        トップページに戻る
      </a>
    </div>
  );
}
