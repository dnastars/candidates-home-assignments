import React from "react";

export function BalanceOf({ balanceOf, symbol }) {
  return (
    <div>
      <h4>Balance of a token:</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the balanceOf callback with the  form data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const symbol = formData.get("symbol");

          if (symbol ) {
            balanceOf(symbol);
          }
        }}
      >
        <div className="form-group">
          <label>Token symbol: </label>
          <input className="form-control" type="text" name="symbol" required />
        </div>
        
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Balance" />
        </div>
      
      </form>
    </div>
  );
}
