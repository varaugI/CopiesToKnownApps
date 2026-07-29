package com.netflixcopy.catalog;

import java.util.List;

final class CatalogModels {

    private CatalogModels() {
    }

    record Title(
            long id,
            String name,
            String eyebrow,
            int year,
            String maturity,
            String duration,
            int match,
            List<String> genres,
            String synopsis,
            List<String> cast,
            String landscape,
            String backdrop,
            String accent,
            Integer rank,
            Integer progress,
            boolean isNew,
            String type
    ) {
    }

    record Row(String slug, String name, List<Long> titleIds) {
    }

    record CatalogResponse(Title featured, List<Row> rows, List<Title> titles) {
    }
}
