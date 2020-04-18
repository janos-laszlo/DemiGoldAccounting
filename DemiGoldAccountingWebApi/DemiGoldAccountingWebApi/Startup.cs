using DemiGoldAccountingWebApi.Persistence;
using DemiGoldAccountingWebApi.Translations;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

namespace DemiGoldAccountingWebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
                });

            services.AddDbContext<DemiGoldAccountingContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DemiGoldAccountingConnectionString")));

            services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<DemiGoldAccountingContext>();

            services.AddTransient<ClientsRepository>();
            services.AddTransient<EmployeesRepository>();
            services.AddTransient<TransactionsRepository>();
            services.AddTransient<TranslationRepository>();
            services.AddTransient<TranslationService>();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "JwtBearer";
                options.DefaultChallengeScheme = "JwtBearer";
            })
            .AddJwtBearer("JwtBearer", jwtBearerOptions =>
            {
                jwtBearerOptions.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("a secret that needs to be at least 16 characters long")),

                    ValidateIssuer = true,
                    ValidIssuer = "http://localhost",

                    ValidateAudience = true,
                    ValidAudience = "http://localhost",

                    ValidateLifetime = true, //validate the expiration and not before values in the token

                    ClockSkew = TimeSpan.FromMinutes(5) //5 minute tolerance for the expiration date
                };
            });
                        
            services.AddCors(options => 
            {
                options.AddPolicy("AllowHomeAndLiveOrigins",
                    builder => builder
                        .WithOrigins(
                            "http://localhost:4200",
                            "http://demigoldaccounting.azurewebsites.net",
                            "https://demigoldaccounting.azurewebsites.net",
                            "http://192.168.1.3:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("AllowHomeAndLiveOrigins");

            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
