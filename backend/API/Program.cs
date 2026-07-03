using API.Application.Interfaces;
using API.Application.Mappings;
using API.Application.Services;
using API.Infrastructure.Data;
using API.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Configure CORS so the React (Vite) frontend can make requests to this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",
                    "http://localhost:5174"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// 3. Register SpilDbContext with SQL Server
builder.Services.AddDbContext<SpilDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 4. Register Data Access Layer – Repositories
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IItemRepository, ItemRepository>();
builder.Services.AddScoped<ISalesOrderRepository, SalesOrderRepository>();

// 5. Register Business Logic Layer – Services
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddScoped<ISalesOrderService, SalesOrderService>();

// 6. Register AutoMapper with the MappingProfile
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

var app = builder.Build();

// 7. Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 8. Enable CORS (must be before Authorization)
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();