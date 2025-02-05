import React, { useEffect, useRef, useState } from "react";
import BpmnJS from "bpmn-js"; // BPMN rendering library

const BpmnViewer = () => {
  const containerRef = useRef(null);
  const bpmnViewer = useRef(null);
  const [bpmnXML, setBpmnXML] = useState(null);

  useEffect(() => {
    bpmnViewer.current = new BpmnJS({ container: containerRef.current });

    if (bpmnXML) {
      bpmnViewer.current
        .importXML(bpmnXML)
        .then(() => {
          //  Auto-fit BPMN diagram on load
          bpmnViewer.current.get("canvas").zoom("fit-viewport");
        })
        .catch((err) => {
          console.error("Error importing BPMN file:", err);
        });
    }

    return () => {
      bpmnViewer.current.destroy();
    };
  }, [bpmnXML]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBpmnXML(e.target.result);
      reader.readAsText(file);
    }
  };

  // Zoom Functions
  const zoomIn = () => {
    bpmnViewer.current.get("canvas").zoom(bpmnViewer.current.get("canvas").zoom() * 1.2);
  };

  const zoomOut = () => {
    bpmnViewer.current.get("canvas").zoom(bpmnViewer.current.get("canvas").zoom() * 0.8);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <input type="file" accept=".bpmn" onChange={handleFileUpload} />
      <div style={{ margin: "10px 0" }}>
        <button onClick={zoomIn} style={{ marginRight: "10px" }}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>
      <div ref={containerRef} style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}></div>
    </div>
  );
};

export default BpmnViewer;
