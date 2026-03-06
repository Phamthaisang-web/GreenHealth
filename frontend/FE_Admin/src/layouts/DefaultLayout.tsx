import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: Props) {
  return <div style={styles.container}>{children}</div>;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
};
