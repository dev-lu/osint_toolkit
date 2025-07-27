import NewspaperIcon from "@mui/icons-material/Newspaper";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CalculateIcon from "@mui/icons-material/Calculate";
import RuleIcon from "@mui/icons-material/Rule";
import InfoIcon from "@mui/icons-material/Info";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import KeyIcon from "@mui/icons-material/Key";
import SettingsIcon from "@mui/icons-material/Settings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArticleIcon from "@mui/icons-material/Article";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import CreateIcon from "@mui/icons-material/Create";
import ViewListIcon from "@mui/icons-material/ViewList";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";

export const mainMenuItems = [
  {
    name: "Newsfeed",
    icon: <NewspaperIcon />,
    path: "/newsfeed",
    enabled: true,
  },
  {
    name: "IOC Tools",
    icon: <SearchIcon />,
    path: "/ioc-tools",
    enabled: true,
  },
  {
    name: "Email Analyzer",
    icon: <MailIcon />,
    path: "/email-analyzer",
    enabled: true,
  },
  {
    name: "Domain Finder",
    icon: <TravelExploreIcon />,
    path: "/domain-monitoring",
    enabled: true,
  },
  {
    name: "AI Templates",
    icon: <PsychologyIcon />,
    path: "/ai-templates",
    enabled: true,
  },
  {
    name: "CVSS Calculator",
    icon: <CalculateIcon />,
    path: "/cvss-calculator",
    enabled: true,
  },
  {
    name: "Detection Rules",
    icon: <RuleIcon />,
    path: "/rules",
    enabled: true,
  },
];

export const aiTemplatesTabs = [
  {
    label: "Templates",
    path: "/ai-templates/templates",
    icon: <ViewListIcon />,
  },
  {
    label: "Create Template",
    path: "/ai-templates/create-template",
    icon: <CreateIcon />,
  },
];

export const iocToolsTabs = [
  {
    label: "Single Lookup",
    path: "/ioc-tools/lookup",
    icon: <SearchIcon />,
  },
  {
    label: "Bulk Lookup",
    path: "/ioc-tools/bulk",
    icon: <ManageSearchIcon />,
  },
  {
    label: "Extractor",
    path: "/ioc-tools/extractor",
    icon: <DocumentScannerIcon />,
  },
  {
    label: "Defang/Fang",
    path: "/ioc-tools/defanger",
    icon: <HealthAndSafetyIcon />,
  },
];

export const newsfeedTabs = [
  {
    label: "Feed",
    path: "/newsfeed/feed",
    icon: <RssFeedIcon />,
  },
  {
    label: "Trends",
    path: "/newsfeed/trends",
    icon: <TrendingUpIcon />,
  },
  {
    label: "Headline View",
    path: "/newsfeed/headlines",
    icon: <ViewHeadlineIcon />,
  },
  {
    label: "News Report",
    path: "/newsfeed/report",
    icon: <ArticleIcon />,
  },
  {
    label: "Settings",
    path: "/newsfeed/settings",
    icon: <SettingsIcon />,
    children: [
      {
        label: "Manage Feeds",
        path: "/newsfeed/settings/feeds",
        icon: <SettingsIcon />,
      },
      {
        label: "Keyword Matching",
        path: "/newsfeed/settings/keywords",
        icon: <SettingsIcon />,
      },
      {
        label: "CTI Settings",
        path: "/newsfeed/settings/cti",
        icon: <SettingsIcon />,
      },
    ],
  },
];

export const settingsTabs = [
  { label: "API Keys", path: "/settings/apikeys", icon: <KeyIcon /> },
  { label: "Modules", path: "/settings/modules", icon: <ViewModuleIcon /> },
  { label: "About", path: "/settings/about", icon: <InfoIcon /> },
];

export const rulesTabs = [
  { label: "Sigma", path: "/rules/sigma", icon: <ManageSearchIcon /> },
  { label: "Yara", path: "/rules/yara", icon: <FindInPageIcon /> },
  { label: "Snort", path: "/rules/snort", icon: <NetworkCheckIcon /> },
];
