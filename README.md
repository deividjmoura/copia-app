![Logo](https://copiaecia.boraimprimir.com.br/storage/logos/logosistema.png)
--- **Copia e Cia App!**
Em desenvolvimento...

## A idéia:

- Cliente ler o QR code, que o direciona para o site onde ele poderá fazer o download do app, ou realizar as ações pela webpage;
- Acessado App/Site cliente escolhe seus arquivos e configurações de impressão;
- Passo anterior concluído, realiza o pagamento;
- E Voilà! A impressão ocorre "automaticamente".
## Este é o esquema básico da ideia:

```mermaid
graph LR
A[Cliente] -- QR --> B(APP) 
A -- QR--> C(Site) 
B --> D((pix)) --> E{Inpressão}
C --> D((pix)) 
```
## Stack utilizada

 
**Front-end:** React, Bootstrap
**Back-end:** Node, Express, MySQL, Axios
