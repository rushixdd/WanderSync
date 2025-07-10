# --- Stage 1: Build ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# copy project files for restore layer-caching
COPY *.sln ./
COPY WanderSync.*/*.csproj ./WanderSync.*/
RUN dotnet restore
# now copy source
COPY . .
RUN dotnet publish -c Release -o /out

# --- Stage 2: Runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "WanderSync.Api.dll"]
