import { useState, useEffect } from "react";

function MessageToast({ showMessages }) {
  const [messageData, setMessageData] = useState(showMessages);

  useEffect(() => {
    setMessageData(showMessages);
  }, [showMessages]);

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        className="toast"
        role="alert"
        id="msgToast"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          <strong className="me-auto fs-5">系統提示</strong>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body bg-white">
          {messageData.msgs.map((msg, index) => (
            <p
              key={index}
              className={`text-start ${
                messageData.type === "error" ? "text-danger" : "text-success"
              }`}
            >
              {msg}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
export default MessageToast;
