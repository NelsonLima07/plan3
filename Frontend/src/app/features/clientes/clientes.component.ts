import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Cliente, SisEmpresa } from './models/cliente.model';
import { ClientesService } from './clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss',
})
export class ClientesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ClientesService);

  viewMode = signal<'list' | 'form'>('list');
  clientes = signal<Cliente[]>([]);
  empresas = signal<SisEmpresa[]>([]);
  filtro = signal<string>('');

  editingId: number | null = null;

  displayedColumns: string[] = ['acoes', 'empresa', 'tipoPessoa', 'nomePessoa', 'cpfCnpj', 'datacadastro'];
  dataSource = new MatTableDataSource<Cliente>([]);

  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  pageIndex = 0;
  pageLength = 0;

  form = this.fb.group({
    idEmpresa: [null as number | null, Validators.required],
    tipoPessoa: ['F' as 'F' | 'J', Validators.required],
    nomePessoa: ['', [Validators.required, Validators.maxLength(120)]],
    cpfCnpj: [''],
  });

  filteredClientes = computed(() => {
    const termo = this.filtro().toLowerCase().trim();
    let lista = this.clientes();
    if (termo) {
      lista = lista.filter((c) => {
        const nome = c.nomePessoa?.toLowerCase() || '';
        const cpf = c.cpfCnpj?.toLowerCase() || '';
        const emp = this.getEmpresaNome(c.idEmpresa).toLowerCase();
        return nome.includes(termo) || cpf.includes(termo) || emp.includes(termo);
      });
    }
    return lista;
  });

  ngOnInit(): void {
    this.carregarEmpresas();
    this.carregarClientes();
  }

  carregarEmpresas(): void {
    this.service.getEmpresas().subscribe({
      next: (res) => this.empresas.set(res),
      error: (err) => console.error(err),
    });
  }

  carregarClientes(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.clientes.set(res);
        this.aplicarFiltro();
      },
      error: (err) => console.error(err),
    });
  }

  aplicarFiltro(): void {
    this.dataSource.data = this.filteredClientes();
    this.pageLength = this.dataSource.data.length;
    this.pageIndex = 0;
    this.dataSource.paginator = null;
  }

  onFiltroChange(valor: string): void {
    this.filtro.set(valor);
    this.aplicarFiltro();
  }

  getEmpresaNome(idEmpresa: number): string {
    return this.empresas().find((e) => e.id === idEmpresa)?.nomeEmpresa || '';
  }

  novo(): void {
    this.editingId = null;
    this.form.reset({
      idEmpresa: null,
      tipoPessoa: 'F',
      nomePessoa: '',
      cpfCnpj: '',
    });
    this.viewMode.set('form');
  }

  editar(cliente: Cliente): void {
    this.editingId = cliente.id ?? null;
    this.form.patchValue({
      idEmpresa: cliente.idEmpresa,
      tipoPessoa: cliente.tipoPessoa,
      nomePessoa: cliente.nomePessoa,
      cpfCnpj: cliente.cpfCnpj,
    });
    this.viewMode.set('form');
  }

  cancelar(): void {
    this.viewMode.set('list');
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const cliente: Cliente = {
      idEmpresa: formValue.idEmpresa!,
      tipoPessoa: formValue.tipoPessoa!,
      nomePessoa: formValue.nomePessoa!,
      cpfCnpj: formValue.cpfCnpj || null,
    };

    if (this.editingId) {
      this.service.update(this.editingId, cliente).subscribe({
        next: () => {
          this.carregarClientes();
          this.viewMode.set('list');
        },
        error: (err) => console.error(err),
      });
    } else {
      this.service.create(cliente).subscribe({
        next: () => {
          this.carregarClientes();
          this.viewMode.set('list');
        },
        error: (err) => console.error(err),
      });
    }
  }

  excluir(cliente: Cliente): void {
    if (!cliente.id) return;
    const confirmado = confirm(`Deseja realmente excluir o cliente "${cliente.nomePessoa}"?`);
    if (!confirmado) return;
    this.service.delete(cliente.id).subscribe({
      next: () => this.carregarClientes(),
      error: (err) => console.error(err),
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get pagedClientes(): Cliente[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredClientes().slice(start, start + this.pageSize);
  }
}
