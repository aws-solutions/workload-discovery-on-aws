import React from 'react';
import { Box, TextContent } from '@awsui/components-react';
import dayjs from 'dayjs';

export default function ApplicationAndVersion() {
  // const classes = useStyles();
  const [status, setStatus] = React.useState(`Next discovery is being calculated`);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStatus(`Next discovery is ${fetchTimeTilUpdate()}`);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTimeTilUpdate = () => {
    var date = dayjs();
    var time = date.valueOf();
    var mint = date.minute();

    var quarter_min = Math.ceil(mint / 15) * 15 + 0 * 15;
    var d2 = dayjs(time + (quarter_min - mint) * 60000);
    return dayjs().to(d2);
  };

  return (
    <Box className="appAndVersion">
      <TextContent>
        <h2>AWS Perspective</h2>
      </TextContent>
      <TextContent>
      <p><small>{window.perspectiveMetadata.version}</small></p>
      </TextContent>
      <TextContent>
        <p><small>{status}</small></p>
      </TextContent>
    </Box>
  );
}
