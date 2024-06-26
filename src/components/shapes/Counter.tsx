import { Button } from "antd";
import { useReducer } from "react";

const initialValue = {
  count: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "increase":
      return { count: state.count + 1 };
      break;
    default:
      break;
  }
}
const Counter = () => {
  const [state, dispath] = useReducer(reducer, initialValue);

  return (
    <div>
      Count: {state.count}
      <Button onClick={() => dispath({ type: "increase" })}>+</Button>
    </div>
  );
};

export default Counter;
