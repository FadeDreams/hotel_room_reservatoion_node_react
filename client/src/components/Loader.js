import React, { useState } from 'react'
import PuffLoader from "react-spinners/PuffLoader";
import RingLoader from "react-spinners/RingLoader";

function Loader() {
  let [loading, setLoading] = useState(true);

  return (
    <div style={{marginTop:'150px'}}>
      <div className="sweet-loading text-center">
        <RingLoader color='#000' loading={loading} css='' size={100} />
        {/* <PuffLoader color='#000' loading={loading} css='' size={100} /> */}
      </div>
    </div>
  )
}

export default Loader;
