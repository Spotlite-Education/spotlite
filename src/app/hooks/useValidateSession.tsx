'use client';

import { useEffect, useState } from 'react';

interface Params {
  validCallback?: () => any;
  invalidCallback?: () => any;
}

export const useValidateSession = ({
  validCallback,
  invalidCallback,
}: Params): void => {
  useEffect(() => {
    const validate = async () => {
      const sessionID = sessionStorage.getItem('sessionID');
      if (!sessionID) {
        if (invalidCallback) {
          invalidCallback();
        }

        return;
      }

      try {
        const res = await fetch(
          'http://localhost:8000/api/game/validateSession',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionID }),
          }
        );

        if (res.status === 200) {
          const { valid } = await res.json();
          if (valid) {
            if (validCallback) {
              validCallback();
            }
          } else {
            if (invalidCallback) {
              invalidCallback();
            }
            sessionStorage.removeItem('sessionID');
          }
        } else if (invalidCallback) {
          invalidCallback();
        }
      } catch (error) {
        console.error(error);
      }
    };

    validate();
  }, []);
};
