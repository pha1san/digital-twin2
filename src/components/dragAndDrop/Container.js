import { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import Box from "./Box";
import update from "immutability-helper";
import Paper from "@material-ui/core/Paper";

const styles = {
  width: "100%",
  height: "600px",
  position: "relative",
};

export default function Container({ hideSourceOnDrag }) {
  const [boxes, setBoxes] = useState({
    a: { top: 20, left: 80, title: "Drag me around" },
    b: { top: 180, left: 20, title: "Drag me too" },
  });
  const moveBox = useCallback(
    (id, left, top) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        })
      );
    },
    [boxes, setBoxes]
  );
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        moveBox(item.id, left, top);
        return undefined;
      },
    }),
    [moveBox]
  );
  return (
    <Paper ref={drop} style={styles}>
      {Object.keys(boxes).map((key) => {
        const { left, top, title } = boxes[key];
        return (
          <Box key={key} id={key} left={left} top={top} hideSourceOnDrag={hideSourceOnDrag}>
            {title}
          </Box>
        );
      })}
    </Paper>
  );
}
