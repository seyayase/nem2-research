import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateWalletComponent } from './pages/create-wallet/create-wallet.component';
import { NamespaceComponent } from './pages/namespace/namespace.component';
import { MosaicComponent } from './pages/mosaic/mosaic.component';
import { TransferTxComponent } from './pages/transfer-tx/transfer-tx.component';
import { ExplorerComponent } from './pages/explorer/explorer.component';
import { MetadataComponent } from './pages/metadata/metadata.component';

const routes: Routes = [
  { path: '', redirectTo: 'explorer', pathMatch: 'full' },
  { path: 'explorer', component: ExplorerComponent },
  { path: 'create-wallet', component: CreateWalletComponent },
  { path: 'namespace', component: NamespaceComponent },
  { path: 'mosaic', component: MosaicComponent },
  { path: 'transfer-tx', component: TransferTxComponent },
  { path: 'metadata', component: MetadataComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
