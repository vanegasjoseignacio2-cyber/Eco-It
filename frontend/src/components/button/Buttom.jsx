import React, { useState, useEffect } from "react";
import styled from "styled-components";

const SendButton = ({ isLoading, isSuccess }) => {
    const [showText, setShowText] = useState(!isSuccess);

    useEffect(() => {
        if (isSuccess) {
            setShowText(false);
            const timer = setTimeout(() => setShowText(true), 1100);
            return () => clearTimeout(timer);
        } else {
            setShowText(true);
        }
    }, [isSuccess]);

    return (
        <StyledWrapper $launch={isSuccess} $fadeIn={isSuccess && showText}>
            <button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <div className="spinner" />
                ) : (
                    <>
                        <div className="svg-wrapper">
                            <svg viewBox="0 0 24 24" width={22} height={22}>
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path
                                    fill="currentColor"
                                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                />
                            </svg>
                        </div>

                        {showText && (
                            <span>
                                {isSuccess ? "Mensaje Enviado" : "Enviar Mensaje"}
                            </span>
                        )}
                    </>
                )}
            </button>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  button {
    width: 100%;
    font-size: 18px;
    background: linear-gradient(90deg, #22c55e, #10b981);
    color: white;
    padding: 16px;
    min-height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;                  /* ← sin gap fijo; el espacio lo maneja el span */
    border: none;
    border-radius: 12px;
    overflow: hidden;
    transition: all .4s;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 8px 20px rgba(0,0,0,.15);
  }

  button:disabled {
    opacity: .7;
    cursor: not-allowed;
  }

  .svg-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    transition: transform .4s ease;
  }

  svg {
    display: block;
  }

  span {
    /* ← colapsa el span en layout usando max-width, no transform */
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    max-width: 200px;
    margin-left: 10px;
    opacity: 1;
    transition: max-width .4s ease, opacity .3s ease, margin-left .4s ease;
  }

  button:not([disabled]):hover span {
    max-width: 0;            /* ← colapsa físicamente → SVG queda centrado */
    opacity: 0;
    margin-left: 0;
  }

  button:not([disabled]):hover .svg-wrapper {
    transform: translateX(6px) rotate(45deg) scale(1.15);
    animation: fly .6s ease-in-out infinite alternate;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid white;
    border-top: 3px solid transparent;
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg) }
  }

  @keyframes fly {
    from { transform: translateY(2px) rotate(45deg) scale(1.15) }
    to   { transform: translateY(-2px) rotate(45deg) scale(1.15) }
  }

  @keyframes launch {
    0%   { transform: translate(0,0) rotate(0); opacity: 1 }
    40%  { transform: translate(40px,-20px) rotate(30deg) }
    80%  { transform: translate(80px,-60px) rotate(45deg); opacity: 0.4 }
    100% { transform: translate(140px,-120px) rotate(50deg); opacity: 0 }
  }

  @keyframes fadeInText {
    from { opacity: 0; transform: translateY(6px) }
    to   { opacity: 1; transform: translateY(0) }
  }

  ${({ $launch }) => $launch && `
    .svg-wrapper {
      animation: launch 1.2s ease-in forwards;
    }
    button:hover .svg-wrapper { animation: none; transform: none; }
    button:hover span { max-width: 200px; opacity: 1; margin-left: 10px; }
  `}

  ${({ $fadeIn }) => $fadeIn && `
    span {
      animation: fadeInText 0.4s ease forwards;
    }
  `}
`;

export default SendButton;