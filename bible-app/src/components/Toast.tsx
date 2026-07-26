import { useApp } from "../context/AppContext";

export function Toast() {
  const { toastMsg } = useApp();
  return <div className={`toast${toastMsg ? " show" : ""}`}>{toastMsg}</div>;
}
