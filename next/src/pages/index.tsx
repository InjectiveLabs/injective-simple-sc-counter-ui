import { useCounterStore } from "@/context/CounterContextProvider";
import React, { useEffect, useState } from "react";

type Props = {};

function Home({}: Props) {
  const [inputCount, setInputCount] = useState("0");
  const { count, isLoading, incrementCount, setContractCounter } =
    useCounterStore();
  useEffect(() => {
    setInputCount(count.toString());
  }, [count]);

  function handleSetCount() {
    setContractCounter(inputCount);
  }
  return (
    <div className='flex justify-center pt-20'>
      <div className='bg-white rounded-lg p-5 text-center'>
        <div>
          <h1>The Count is</h1>
          <p>{isLoading ? "loading..." : count}</p>
        </div>
        <div>
          <button
            onClick={incrementCount}
            className='btn w-full'
            disabled={isLoading}
          >
            +
          </button>
          <div className='py-2 flex gap-2'>
            <input
              type='number'
              value={inputCount}
              step={1}
              onChange={(e) => setInputCount(e.target.value)}
              className='border rounded-lg p-2'
            />
            <button
              onClick={handleSetCount}
              className='btn'
              disabled={isLoading}
            >
              Set Count
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
