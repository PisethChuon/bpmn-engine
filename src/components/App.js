import React, { useEffect, useRef, useState } from "react";
import BpmnJS from "bpmn-js";

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
          // Auto-fit BPMN diagram on load
          bpmnViewer.current.get("canvas").zoom("fit-viewport");
        })
        .catch((err) => {
          console.error("Error importing BPMN file:", err);
        });
    }

    // Add event listener for zooming with Ctrl + Mouse Scroll
    const handleWheelZoom = (event) => {
      if (event.ctrlKey) {
        event.preventDefault(); // Prevent default zooming behavior
        const canvas = bpmnViewer.current.get("canvas");
        const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9; // Scroll up to zoom in, down to zoom out
        canvas.zoom(canvas.zoom() * zoomFactor);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheelZoom);
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheelZoom);
      }
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

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <input type="file" accept=".bpmn" onChange={handleFileUpload} />
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "500px",
          border: "1px solid #ccc",
          marginTop: "10px",
        }}
      ></div>
    </div>
  );
};

export default BpmnViewer;
