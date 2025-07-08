import { Box, Card, CardContent, Skeleton } from '@mui/material';

const LoadingSkeleton = () => (
  <Box>
    {[1,2,3].map(i => (
      <Card key={i} sx={{ mb: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="80%" />
          <Box mt={2}>
            <Skeleton variant="rectangular" height={56} />
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default LoadingSkeleton;
