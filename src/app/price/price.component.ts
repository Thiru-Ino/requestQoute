import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit, OnDestroy {
  priceUpdates: any[] = [];
  private priceUpdateSubscription: Subscription | null = null;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.setupSocketConnection();
  }

  ngOnDestroy(): void {
    if (this.priceUpdateSubscription) {
      this.priceUpdateSubscription.unsubscribe();
    }
    this.socketService.disconnect();
  }

  setupSocketConnection(): void {
    this.socketService.emit('inputFiat', 'USD'); // Default currency

    this.priceUpdateSubscription = this.socketService.on('return_price').subscribe((data: any) => {
      this.priceUpdates = this.parsePriceData(data.prices);
      console.log(`this.priceUpdates `,this.priceUpdates)
    });
  }

  onCurrencyButtonClick(currency: string): void {
    this.socketService.emit('inputFiat', currency);
  }

  parsePriceData(prices: any): any[] {
    const parsedData = [];
    for (const currency in prices) {
      if (prices.hasOwnProperty(currency)) {
        parsedData.push({ name: currency, price: prices[currency] });
      }
    }
    return parsedData;
  }
}
