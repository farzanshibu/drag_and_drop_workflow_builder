"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useCallback } from "react";
import { useReactFlow } from "reactflow";

type Props = {};

export default function MenuToolBar({}: Props) {
  const { setViewport, zoomIn, zoomOut } = useReactFlow();

  const handleFitView = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 });
  }, [setViewport]);
  return (
    <Menubar className="hidden lg:flex">
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Auto Layout Nodes</MenubarItem>
          <MenubarItem onClick={handleFitView}>Fit View</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => zoomIn({ duration: 800 })}>
            Zoom 100%
          </MenubarItem>
          <MenubarItem onClick={() => zoomIn({ duration: 800 })}>
            Zoom In
          </MenubarItem>
          <MenubarItem onClick={() => zoomOut({ duration: 800 })}>
            Zoom Out
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>All Nodes</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Instructions</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
