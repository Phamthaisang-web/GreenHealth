import React from "react";

interface Props {
  title: string;
}

export default function CardComponent({ title }: Props) {
  return <div style={cardStyle}>{title}</div>;
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "16px",
  width: "200px",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  fontSize: "18px",
  fontWeight: 600,
  textAlign: "center",
  transition: "0.3s",
  cursor: "pointer",
};
