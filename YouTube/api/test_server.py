import unittest

from server import load_feed, search_feed


class FeedApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.feed = load_feed()

    def test_catalog_shape(self) -> None:
        self.assertEqual(12, len(self.feed["videos"]))
        self.assertEqual(6, len(self.feed["shorts"]))
        self.assertIn("All", self.feed["categories"])

    def test_search_matches_title_and_category(self) -> None:
        self.assertEqual(["city-after-dark"], [video["id"] for video in search_feed(self.feed, "Tokyo")])
        self.assertEqual(2, len(search_feed(self.feed, "Cooking")))


if __name__ == "__main__":
    unittest.main()
