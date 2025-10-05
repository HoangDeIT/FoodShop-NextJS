"use client"
const AuthLayoutUI = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <div

            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `
      radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
      linear-gradient(135deg, #667eea, #764ba2)
    `,
                backgroundSize: "200% 200%",
                animation: "waves 10s linear infinite",
            }}
        >
            <style jsx global>{`
  @keyframes waves {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 0% 0%;
    }
  }
`}</style>
            {children}
        </div>
    )
}
export default AuthLayoutUI;