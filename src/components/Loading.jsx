function Loading() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "600px" }}
    >
      <div className="d-flex justify-content-center">
        <span
          className="spinner-border spinner-border-sm me-1"
          aria-hidden="true"
        ></span>
        <span role="status">Loading...</span>
      </div>
    </div>
  );
}
export default Loading;
