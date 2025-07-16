# --- Stage 1: Build ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY WanderSync.sln ./
COPY WanderSync.*/*.csproj ./WanderSync.*/

RUN dotnet restore

COPY . .
RUN dotnet publish WanderSync.Api/WanderSync.Api.csproj -c Release -o /out

# --- Stage 2: Runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "WanderSync.Api.dll"]
