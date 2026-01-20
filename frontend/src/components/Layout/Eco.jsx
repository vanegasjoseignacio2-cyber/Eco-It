import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className="button">
        <span className="actual-text">Eco-It</span>
        <span aria-hidden="true" className="hover-text">Eco-It</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    margin: 0;
    height: auto;
    background: transparent;
    padding: 0;
    border: none;
    cursor: pointer;
    position: relative;
  }

  .button {
    --text-color: #1B6F69;
    --animation-color: #1B6F69;
    --animation-blur: #1FEBDD;
    --fs-size: 2rem;
    letter-spacing: 1px;
    font-size: var(--fs-size);
    font-weight: 700;
    position: relative;
    text-transform: uppercase;
    transition: all 0.8s ease;
  }

  .actual-text {
    background: linear-gradient(135deg, #1B6F69 0%, #37C0B7 50%, #1FEBDD 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: all 0.8s ease;
  }

  .hover-text {
    position: absolute;
    left: 0;
    top: 0;
    color: var(--animation-color);
    width: 0%;
    overflow: hidden;
    transition: width 0.8s ease;
    white-space: nowrap;
  }

  .button:hover .actual-text {
    opacity: 0;
  }

  .button:hover .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 15px var(--animation-blur));
  }
`;

export default Button;