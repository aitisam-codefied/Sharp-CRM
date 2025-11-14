import React from "react";
import { CarryOutOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import type { TreeDataNode } from "antd";
import { Badge } from "@/components/ui/badge"; // Assuming you're using shadcn/ui for Badge

interface TreeDemoProps {
  treeData: TreeDataNode[];
}

const TreeDemo: React.FC<TreeDemoProps> = ({ treeData }) => {
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log("selected", selectedKeys, info);
  };

  // Function to render custom title for tree nodes
  const renderTitle = (node: TreeDataNode) => {
    const title = node.title as string;
    // Check if the title contains the specific note for red badge
    const isCriticalNote = title.includes(
      "Note: This floor needs staff assignment."
    );

    if (title.includes("Locations")) {
      return <span>Floors</span>;
    }

    // If the title contains "Note:", wrap the note part in a Badge
    if (title.includes("Note:")) {
      const [prefix, note] = title.split(" - Note: ");
      return (
        <span>
          {prefix && <span>{prefix}</span>}
          <div
            className={
              isCriticalNote
                ? "bg-red-100 text-red-800 border-red-300 ml-2 w-fit px-2 py-1 rounded-none lg:rounded-full text-xs sm:text-sm"
                : "bg-yellow-100 text-yellow-800 border-yellow-300 ml-2 w-fit px-2 py-1 rounded-none lg:rounded-full text-xs sm:text-sm"
            }
          >
            Note: {note}
          </div>
        </span>
      );
    }

    return <span>{title}</span>;
  };

  // Recursively process treeData to apply custom title rendering
  const processTreeData = (nodes: TreeDataNode[]): TreeDataNode[] => {
    return nodes.map((node) => ({
      ...node,
      title: renderTitle(node),
      children: node.children ? processTreeData(node.children) : undefined,
    }));
  };

  return (
    <div>
      <Tree
        showLine={true}
        showIcon={false}
        defaultExpandAll={false} // Changed to false to keep tree collapsed initially
        // onSelect={onSelect}
        treeData={processTreeData(treeData)}
      />
    </div>
  );
};

export default TreeDemo;
