import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FEED_METRICS } from '../feed.data';

/** Abertura institucional da Home com a faixa de indicadores da empresa. */
@Component({
  selector: 'app-feed-hero',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feed-hero.component.html',
  styleUrl: './feed-hero.component.scss',
})
export class FeedHero {
  protected readonly metrics = FEED_METRICS;
}
