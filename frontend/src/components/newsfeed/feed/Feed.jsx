import React, { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";

import api from "../../../api";
import { newsfeedState, apiKeysState } from "../../../state";

import {
  Pagination,
  Typography,
  Box,
  Stack
} from "@mui/material";
import NewsArticleItem from "./NewsArticleItem";
import NewsfeedSkeleton from "./NewsfeedSkeleton";
import Filters from "./Filters";

export default function Newsfeed() {
  const setNewsfeed = useSetRecoilState(newsfeedState);
  const apiKeys = useRecoilValue(apiKeysState);

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    has_matches: null,
    has_iocs: null,
    has_relevant_iocs: null,
    has_analysis: null,
    has_note: null,
    tlp: "",
    read: null,
  });
  
  const pageSize = 15;

  const tlpColors = {
    "TLP:RED": "#FF0000",
    "TLP:AMBER": "#FFBF00",
    "TLP:GREEN": "#00FF00",
    "TLP:CLEAR": "#CCCCCC",
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 120,
      behavior: "smooth",
    });
  };

  const fetchData = async (pageToFetch = page) => {
    try {
      setLoading(true);
      setNewsfeed([]);
      const url = "/api/newsfeed/articles";
      const response = await api.get(url, {
        params: { ...filters, page: pageToFetch, page_size: pageSize }, 
      });
      setResult(response.data); 
      setNewsfeed(response.data.articles); 
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1); 
  };

  // Reset filters
  const resetFilters = () => {
    const resetState = {
      start_date: "",
      end_date: "",
      has_matches: null,
      has_iocs: null,
      has_relevant_iocs: null,
      has_analysis: null,
      has_note: null,
      tlp: "",
      read: null,
    };
    setFilters(resetState);
    setPage(1);
  };

  const refreshData = () => {
    fetchData();
  };

  return (
    <>
      <Stack spacing={1} width="100%">
        {/* Filters and refresh button */}
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            width: '100%'
          }}
        >
          {/* Filters */}
          <Box sx={{ flex: 1, mb: 1 }}>
            <Filters 
              filters={filters}
              setFilters={setFilters}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
              refreshData={refreshData}
            />
          </Box>
        </Box>

        {/* Content section */}
        {loading ? (
          <NewsfeedSkeleton pageSize={pageSize} />
        ) : result.articles && result.articles.length > 0 ? (
          <>
            <Stack spacing={2}>
              {result.articles.map((item) => (
                <NewsArticleItem
                  key={item.id}
                  item={item}
                  updateArticle={(updatedArticle) => {
                    setResult((prev) => ({
                      ...prev,
                      articles: prev.articles.map((article) =>
                        article.id === updatedArticle.id ? updatedArticle : article
                      ),
                    }));
                    setNewsfeed((prev) =>
                      prev.map((article) =>
                        article.id === updatedArticle.id ? updatedArticle : article
                      )
                    );
                  }}
                  updateArticleField={(articleId, field, value) => {
                    const updateFieldLocally = (items) =>
                      items.map((item) =>
                        item.id === articleId ? { ...item, [field]: value } : item
                      );
                    setResult((prev) => ({
                      ...prev,
                      articles: updateFieldLocally(prev.articles),
                    }));
                    setNewsfeed(updateFieldLocally);
                  }}
                  apiKeys={apiKeys}
                  api={api}
                  tlpColors={tlpColors}
                />
              ))}
            </Stack>

            <Pagination
              count={Math.ceil(result.total_count / pageSize)}
              page={page}
              color="primary"
              shape="rounded"
              size="large"
              showFirstButton
              showLastButton
              onChange={handlePageChange}
              sx={{ display: "flex", justifyContent: "center", mt: 4 }}
            />
          </>
        ) : (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No articles found.
          </Typography>
        )}
      </Stack>
    </>
  );
}