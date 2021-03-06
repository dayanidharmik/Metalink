import React from "react";

const MyAccordion = ({ title, ans, heading, key1, target }) => {
  return (
    <div>
      <div className="acc__card ">
        <h2 className="accordion-header accordion-header" id={heading}>
          <div
            className="acc__title accordion-button collapsed"
            data-bs-toggle="collapse"
            data-bs-target={target}
            aria-expanded="false"
            aria-controls="flush-collapseOne"
            type="button"
          >
            {title}
          </div>
        </h2>
        <div
          id={key1}
          className="accordion-collapse collapse "
          aria-labelledby={heading}
          data-bs-parent="#accordionFlushExample"
        >
          <div className="acc_ans">
            <br />
            {[...ans].map((data, i) => {
              return <p key={i}>{data} </p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccordion;
