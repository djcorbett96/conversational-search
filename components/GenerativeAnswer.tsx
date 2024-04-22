import React from 'react';
import Markdown from 'markdown-to-jsx';

type Props = {
  answer: string;
};

export default function GenerativeAnswer({ answer }: Props) {
  return answer ? (
    <div dir="auto" className="markdown-reverts">
      <Markdown
        options={{
          forceBlock: true,
        }}
      >
        {answer}
      </Markdown>
    </div>
  ) : null;
}
