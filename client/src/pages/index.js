import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Cookies } from "react-cookie";
import { setTheme } from "@/redux/slices/themeSlice";
import { Loader } from "@/components/common/uiComponents";
import Layout from "@/components/common/layoutComponent";
import HomeContent, { featuredGames, popularGames } from "@/components/common/HomeContent";
import { GameCategory, Hero } from "@/components/common/homeComponents";

const cookies = new Cookies();

const racingGames = [
  { name: "F1 23", developer: "dev_f1", image: "https://tse2.mm.bing.net/th/id/OIP.l_Tv70M8jw5Eg8Rge8WxMwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Need For Speed", developer: "dev_nfs", image: "https://th.bing.com/th/id/OIP.9ZRHAfPDQ1I2n0CrIqRvSgHaEK?w=280&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3" },
  { name: "Asphalt 9", developer: "dev_asphalt", image: "https://vignette.wikia.nocookie.net/asphalt/images/2/22/A9_1.0_icon.png/revision/latest?cb=20180420125431" },
  { name: "Dirt 5", developer: "dev_dirt", image: "https://th.bing.com/th/id/OIP.nWQffnCMYtWLHGcfFsvN6gHaEK?w=281&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3" },
  { name: "Hot Wheels Unleashed", developer: "dev_hotwheels", image: "https://tse1.mm.bing.net/th/id/OIP.Or1YxLr7MlYb7-n3TfZSCwHaEd?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Mario Kart", developer: "dev_mario", image: "https://tse1.mm.bing.net/th/id/OIP.V8_waXQCHG7uy6g5fpGSngHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Forza Horizon 5", developer: "dev_forza", image: "https://cdn1.epicgames.com/offer/carousel/forza-horizon-5_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" },
  { name: "Gran Turismo 7", developer: "dev_gt7", image: "https://cdn.mos.cms.futurecdn.net/8qJqJqJqJqJqJqJqJqJqJq.jpg" },
  { name: "Trackmania", developer: "dev_trackmania", image: "https://cdn1.epicgames.com/offer/carousel/trackmania_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" },
  { name: "WRC 10", developer: "dev_wrc", image: "https://cdn1.epicgames.com/offer/carousel/wrc-10_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" }
];

const actionGames = [
  { name: "NBA 2K24", developer: "dev_nba", image: "https://th.bing.com/th/id/OIP.Ofg-uFWstIeAqXH9GEqC4QHaI5?w=149&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3" },
  { name: "Tekken 8", developer: "dev_tekken", image: "https://assets-prd.ignimgs.com/2022/09/15/tekken8-1663261659390.jpg" },
  { name: "Assassin's Creed", developer: "dev_ac", image: "https://tse3.mm.bing.net/th/id/OIP.MWv957MVXpqNhT3ayDZzNgHaKc?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Elden Ring", developer: "dev_elden", image: "https://static.bandainamcoent.eu/high/elden-ring/elden-ring/00-page-setup/elden-ring-new-header-mobile.jpg" },
  { name: "Spider-Man", developer: "dev_spiderman", image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/12/spider-man.jpeg" },
  { name: "God of War", developer: "dev_gow", image: "https://image.api.playstation.com/vulcan/img/rnd/202010/2217/ax0V5TYMax06mLzmkWeQMiwH.jpg" },
  { name: "Devil May Cry 5", developer: "dev_dmc5", image: "https://cdn1.epicgames.com/offer/carousel/devil-may-cry-5_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" },
  { name: "Doom Eternal", developer: "dev_doom", image: "https://cdn1.epicgames.com/offer/carousel/doom-eternal_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" },
  { name: "Sekiro", developer: "dev_sekiro", image: "https://cdn1.epicgames.com/offer/carousel/sekiro_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" },
  { name: "Dark Souls 3", developer: "dev_darksouls", image: "https://cdn1.epicgames.com/offer/carousel/dark-souls-3_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" }
];

export default function Home() {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({ genre: "", keyword: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const theme = cookies.get("theme");
    if (theme) dispatch(setTheme(theme));
    setLoading(false);
  }, [dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <Loader fullscreen />;

  return (
    <>
      <Head>
        <title>CyberArena - Discover & Play Indie Games Instantly</title>
        <meta name="description" content="Join a growing community and explore something unique" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout filters={filters} onFilterChange={handleFilterChange}>
        <Hero />
        <HomeContent filters={filters} showHero={false} />
        <GameCategory title="RACING GAMES" description="Fast-paced racing action" category="racing" games={racingGames} />
        <GameCategory title="ACTION GAMES" description="Thrilling action-packed adventures" category="action" games={actionGames} />
      </Layout>
    </>
  );
}
