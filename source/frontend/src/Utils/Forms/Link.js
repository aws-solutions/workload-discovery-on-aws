import React from 'react';


export default ({ label, id, onClick }) => {

  const handleClick = () => {
    onClick(id)
  };
  return (
    <button
      onClick={e => {
        handleClick();
      }}
      className="resourceLink">
      {label}
    </button>
  );
};
