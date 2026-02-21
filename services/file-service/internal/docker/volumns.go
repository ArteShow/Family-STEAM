package docker

import (
	"archive/tar"
	"bytes"
	"context"
	"errors"
	"io"
	"path"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/google/uuid"
)

const VolumeName = "family-steam"

func UploadFile(fileBytes []byte, filename string) (string, error) {
	ctx := context.Background()

	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return "", err
	}

	id := uuid.New().String()

	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: "alpine:3.19",
		Cmd:   []string{"sleep", "60"},
	}, &container.HostConfig{
		Binds: []string{VolumeName + ":/data"},
	}, nil, nil, "")
	if err != nil {
		return "", err
	}

	containerID := resp.ID

	err = cli.ContainerStart(ctx, containerID, container.StartOptions{})
	if err != nil {
		return "", err
	}

	buf := new(bytes.Buffer)
	tw := tar.NewWriter(buf)

	err = tw.WriteHeader(&tar.Header{
		Name: path.Join(id, filename),
		Mode: 0644,
		Size: int64(len(fileBytes)),
	})
	if err != nil {
		return "", err
	}

	_, err = tw.Write(fileBytes)
	if err != nil {
		return "", err
	}

	tw.Close()

	err = cli.CopyToContainer(ctx, containerID, "/data", buf, container.CopyToContainerOptions{})
	if err != nil {
		return "", err
	}

	cli.ContainerRemove(ctx, containerID, container.RemoveOptions{Force: true})

	return id, nil
}

func DownloadFile(id string) ([]byte, error) {
	ctx := context.Background()

	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return nil, err
	}

	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: "alpine:3.19",
		Cmd:   []string{"sleep", "60"},
	}, &container.HostConfig{
		Binds: []string{VolumeName + ":/data"},
	}, nil, nil, "")
	if err != nil {
		return nil, err
	}

	containerID := resp.ID

	err = cli.ContainerStart(ctx, containerID, container.StartOptions{})
	if err != nil {
		return nil, err
	}
	defer cli.ContainerRemove(ctx, containerID, container.RemoveOptions{Force: true})

	reader, _, err := cli.CopyFromContainer(ctx, containerID, path.Join("/data", id))
	if err != nil {
		return nil, err
	}
	defer reader.Close()

	tr := tar.NewReader(reader)

	for {
		hdr, nextErr := tr.Next()
		if nextErr == io.EOF {
			return nil, errors.New("file not found in folder")
		}
		if nextErr != nil {
			return nil, nextErr
		}

		if hdr.Typeflag != tar.TypeReg {
			continue
		}

		data, readErr := io.ReadAll(tr)
		if readErr != nil {
			return nil, readErr
		}

		return data, nil
	}
}

func RemoveFile(id string) error {
	ctx := context.Background()

	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return err
	}

	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: "alpine:3.19",
		Cmd:   []string{"rm", "-rf", path.Join("/data", id)},
	}, &container.HostConfig{
		Binds: []string{VolumeName + ":/data"},
	}, nil, nil, "")
	if err != nil {
		return err
	}

	containerID := resp.ID

	err = cli.ContainerStart(ctx, containerID, container.StartOptions{})
	if err != nil {
		return err
	}

	cli.ContainerRemove(ctx, containerID, container.RemoveOptions{Force: true})

	return nil
}
