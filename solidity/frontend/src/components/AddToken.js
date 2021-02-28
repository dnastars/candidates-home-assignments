import React from "react";

export function AddToken({ addToken, symbol, address }) {
  return (
    <div>
      <h4>Add new token</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the addToken callback with the  form data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const symbol = formData.get("symbol");
          const address = formData.get("address");          

          if (symbol && address) {
            addToken(symbol, address);
          }
        }}
      >
        <div className="form-group">
          <label>Token symbol: </label>
          <input className="form-control" type="text" name="symbol" required />
        </div>
        
        <div className="form-group">
          <label>Token address: </label>
          <input className="form-control" type="text" name="address" required />
        </div>
        
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Add Token" />
        </div>
      
      </form>
    </div>
  );
}
