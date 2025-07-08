import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import {
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const TemplateCard = ({
  template,
  selected,
  onSelect,
  onShowExample,
  onEdit,
  onDelete
}) => (
  <Card
    variant="outlined"
    sx={{
      mb: 1,
      width: '100%',
      boxSizing: 'border-box',
      p: 1,
      borderColor: selected ? 'primary.main' : 'transparent',
      borderWidth: selected ? 2 : 1,
      cursor: 'pointer',
      borderRadius: 2,
      boxShadow: selected ? 3 : 1,
      transition: 'box-shadow 0.2s ease',
      '&:hover': { boxShadow: 4 },
    }}
    onClick={() => onSelect(template)}
  >
    <CardContent sx={{ py: 1, px: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="subtitle1"
          sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          {template.title}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 0.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {template.description}
      </Typography>
    </CardContent>
    <CardActions sx={{ px: 1, py: 0.5, justifyContent: 'flex-end' }}>
      <IconButton
        size="small"
        onClick={e => {
          e.stopPropagation();
          onShowExample(template);
        }}
      >
        <InfoIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={e => {
          e.stopPropagation();
          onEdit(template);
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={e => {
          e.stopPropagation();
          onDelete(template);
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </CardActions>
  </Card>
);

export default TemplateCard;
