import { useState, useEffect } from "react";
function Pagination({ pagination, onChangePage }) {
  const [thisPagination, setThisPagination] = useState(pagination);

  const handlePageBtnClick = (e, page) => {
    e.preventDefault();
    onChangePage(page);
  };

  useEffect(() => {
    setThisPagination(pagination);
  }, [pagination]);

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <a
            href="#"
            onClick={(e) =>
              handlePageBtnClick(e, thisPagination.current_page - 1)
            }
            className={`page-link ${!thisPagination.has_pre && "disabled"}`}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {Array.from({ length: thisPagination.total_pages }, (_, index) => (
          <li className="page-item" key={`page_${index + 1}`}>
            <a
              className={`page-link ${thisPagination.current_page === index + 1 && "active"}`}
              href="#"
              onClick={(e) => handlePageBtnClick(e, index + 1)}
            >
              {index + 1}
            </a>
          </li>
        ))}

        <li className="page-item">
          <a
            href="#"
            onClick={(e) =>
              handlePageBtnClick(e, thisPagination.current_page + 1)
            }
            className={`page-link ${!thisPagination.has_next && "disabled"}`}
          >
             <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
export default Pagination;
