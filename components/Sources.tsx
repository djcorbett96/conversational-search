import React from 'react';
import { FaFilePdf } from 'react-icons/fa6';

const Sources = ({ sources }) => {
  const uniqueSources = sources.reduce((accumulator, current) => {
    if (!accumulator.find((item) => item.id == current.id)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  return (
    <section className="flex gap-4">
      {uniqueSources.map((source, i) => {
        return (
          <a href={source.rawData.c_file.url} target="_blank">
            <div
              key={i}
              className="bg-slate-100 rounded-lg p-2 w-48 flex gap-2 hover:bg-slate-200 hover:cursor-pointer"
            >
              <FaFilePdf className="w-8 h-8" />
              <p className="text-sm text-semibold line-clamp-2">
                {source.rawData.name}
              </p>
            </div>
          </a>
        );
      })}
    </section>
  );
};

export default Sources;
