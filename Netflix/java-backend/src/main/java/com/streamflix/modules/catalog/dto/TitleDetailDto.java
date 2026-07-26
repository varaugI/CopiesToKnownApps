package com.streamflix.modules.catalog.dto;

import com.streamflix.modules.catalog.domain.Title;

import java.util.ArrayList;
import java.util.List;

public class TitleDetailDto extends TitleDto {
    private List<SeasonDto> seasons = new ArrayList<>();

    public TitleDetailDto() {}

    public TitleDetailDto(Title title) {
        super(title);
        if (title.getSeasons() != null) {
            this.seasons = title.getSeasons().stream().map(SeasonDto::new).toList();
        }
    }

    public List<SeasonDto> getSeasons() { return seasons; }
    public void setSeasons(List<SeasonDto> seasons) { this.seasons = seasons; }
}
