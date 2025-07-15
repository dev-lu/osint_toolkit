import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { indigo, teal } from '@mui/material/colors';

const ArticleTable = ({ selectedArticleIds, selectedTitle, articleDetails, articleLoading }) => {
  const theme = useTheme();

  if (!selectedTitle || selectedArticleIds.length === 0) {
    return null;
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" color="text.primary">
            Articles containing
          </Typography>
          <Chip
            label={selectedTitle}
            sx={{
              ml: 1,
              mr: 1,
              bgcolor: theme.palette.mode === 'dark' ? indigo[900] : indigo[100],
              color: theme.palette.mode === 'dark' ? indigo[100] : indigo[900],
              fontWeight: 'medium'
            }}
          />
          <Typography variant="body1" color="text.secondary">
            ({selectedArticleIds.length} occurrences)
          </Typography>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedArticleIds.map((articleId) => {
                const article = articleDetails[articleId];
                const isLoading = articleLoading[articleId];

                if (isLoading) {
                  return (
                    <TableRow key={articleId}>
                      <TableCell colSpan={4}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CircularProgress size={20} />
                          <Typography variant="body2">Loading article details...</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                }

                if (article?.error) {
                  return (
                    <TableRow key={articleId}>
                      <TableCell colSpan={4}>
                        <Alert severity="error" size="small">
                          Error loading article {articleId}: {article.error}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  );
                }

                if (!article) {
                  return (
                    <TableRow key={articleId}>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary">
                          Article details not available.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                }

                return (
                  <TableRow key={articleId} hover>
                    <TableCell>
                      <Chip
                        label={article.feedname}
                        size="small"
                        sx={{
                          bgcolor: theme.palette.mode === 'dark' ? teal[900] : teal[50],
                          color: theme.palette.mode === 'dark' ? teal[100] : teal[700],
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: '1.4em',
                          maxHeight: '2.8em'
                        }}
                      >
                        {article.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(article.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {article.link && (
                        <Tooltip title="Open article">
                          <IconButton
                            size="small"
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: theme.palette.mode === 'dark' ? teal[300] : teal[700]
                            }}
                          >
                            <LaunchIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ArticleTable;