package com.plan3.service

import com.plan3.domain.Cliente
import com.plan3.repository.ClienteRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import java.time.LocalDateTime

@ApplicationScoped
class ClienteService(private val clienteRepository: ClienteRepository) {

    fun listAll(): List<Cliente> = clienteRepository.findAllActive()

    fun findById(id: Long): Cliente? = clienteRepository.findById(id)?.takeIf { it.deleteAt == null }

    @Transactional
    fun create(cliente: Cliente): Cliente {
        cliente.deleteAt = null
        cliente.updateAt = null
        cliente.persist()
        return cliente
    }

    @Transactional
    fun update(id: Long, cliente: Cliente): Cliente? {
        val existing = clienteRepository.findById(id) ?: return null
        if (existing.deleteAt != null) return null
        existing.idEmpresa = cliente.idEmpresa
        existing.tipoPessoa = cliente.tipoPessoa
        existing.nomePessoa = cliente.nomePessoa
        existing.cpfCnpj = cliente.cpfCnpj
        existing.updateAt = LocalDateTime.now()
        existing.persist()
        return existing
    }

    @Transactional
    fun delete(id: Long): Boolean = clienteRepository.softDelete(id)
}
