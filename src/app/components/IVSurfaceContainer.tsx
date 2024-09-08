"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";
import SurfaceGraphContainer from "./IVSurfaceGraph";

export default function IVSurfaceContainer() {
  const [panels, setPanels] = useState([{ id: 1 }, {id: 2}]);

  const addPanel = () => {
    if (panels.length < 2) {
      setPanels([...panels, { id: panels.length + 1 }]);
    }
  };

  const removePanel = (id: number) => {
    setPanels(panels.filter((panel) => panel.id !== id));
  };

  const renderPanels = () => {
    return panels.map((panel) => (
      <ResizablePanel key={panel.id} defaultSize={50} minSize={30}>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-2">
            <span className="text-sm font-semibold">Graph {panel.id}</span>
            <Button
              onClick={() => removePanel(panel.id)}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-grow overflow-hidden">
            <SurfaceGraphContainer
              strikeRange={[100, 350]}
              weeksRange={[0, 20]}
            />
          </div>
        </div>
      </ResizablePanel>
    ));
  };
  return (
    <Card className="col-span-4 row-span-4 flex flex-col h-[1200px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>IV Surface Graphs</CardTitle>
        <Button
          onClick={addPanel}
          variant="outline"
          size="icon"
          disabled={panels.length >= 4}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ResizablePanelGroup direction="vertical" className="h-full">
          <ResizablePanel defaultSize={panels.length > 2 ? 50 : 100} minSize={30}>
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {panels.length > 0 && renderPanels()[0]}
              {panels.length > 1 && (
                <>
                  <ResizableHandle />
                  {renderPanels()[1]}
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
          {panels.length > 2 && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={50} minSize={30}>
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  {renderPanels()[2]}
                  {panels.length > 3 && (
                    <>
                      <ResizableHandle />
                      {renderPanels()[3]}
                    </>
                  )}
                </ResizablePanelGroup>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}
